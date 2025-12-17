import { Request, Response } from 'express';
import { Op } from 'sequelize';
import User from '../models/user';
import redis from '../config/redis';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    const cacheKey = `users:page:${page}:limit:${limit}:search:${search}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const whereClause = search
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const response = {
      users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };

    await redis.set(cacheKey, JSON.stringify(response), 'EX', 300); // cache for 5mins

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cacheKey = `user:${id}`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await redis.set(cacheKey, JSON.stringify(user), 'EX', 300);

    res.status(200).json(user);
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    await redis.del(`user:${userId}`);

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    await redis.del(`user:${id}`);
    const keys = await redis.keys('users:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};
