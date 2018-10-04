/* eslint-disable no-unused-vars */

import Model from '../models';

const { Profile, User } = Model;

/**
  * @class ProfileController
  * @description CRUD operations on Profile
  */
export default class ProfileController {
  /**
  * @description -This method creates profile for a authenticated user
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent back from the controller
  * @returns {object} - status, message and profile detail
  */
  static createOrUpdate(req, res) {
    const userId = req.user.id || req.body.userId;
    const body = ProfileController.updateReqBody(req, userId);

    return Profile.findOne({
      where: { userId },
    })
      .then((profile) => {
        if (profile) {
          return profile.update(body)
            .then(data => ({ created: false, data }));
        }
        return Profile.create(body)
          .then(data => ({ created: true, data }));
      })
      .then(({ created, data }) => {
        if (created) {
          return res.status(201).json({ success: true, message: 'Profile created successfully', data });
        }
        return res.status(200).json({ success: true, message: 'Profile updated successfully', data });
      })
      .catch(err => res.status(500).json({ error: 'Profile could not be updated' }));
  }

  /**
  * @description -This method get profile detail by id
  * @param {object} req - The request payload sent to the router
  * @param {object} res - The response payload sent back from the controller
  * @returns {object} - status, message and profile detail
  */
  static get(req, res) {
    return Profile.findOne({
      where: { id: req.params.id },
      include: [{
        model: User,
        attributes: ['email', 'username']
      }]
    })
      .then(profile => res.status(200).json({ profile }))
      .catch(err => res.status(500).json({ error: 'Failed to fetch profile' }));
  }

  /**
  * @description -This method get all profile details
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent back from the controller
  * @returns {object} - status, message and profile detail
  */
  static getAll(req, res) {
    return Profile.findAll({
      include: [{
        model: User,
        attributes: ['email', 'username']
      }]
    })
      .then(profiles => res.status(200).json({ profiles }))
      .catch(err => res.status(500).json({ error: 'Failed to fetch profiles' }));
  }

  /**
  * @description -This method get profile detail of a authenticated user
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent back from the controller
  * @returns {object} - status, message and profile detail
  */
  static getOne(req, res) {
    const userId = req.user.id || req.body.userId;

    return Profile.findOne({
      where: { userId },
      include: [{
        model: User,
        attributes: ['email', 'username']
      }]
    })
      .then(profile => res.status(200).json({ profile }))
      .catch(err => res.status(500).json({ error: 'Failed to fetch profile' }));
  }

  /**
  * @description -This method updates user profile
  * @param {object} req - The request payload sent from the router
  * @param {object} res - The response payload sent back from the controller
  * @returns {object} - status, message and profile detail
  */
  static update(req, res) {
    const userId = req.user.id || req.body.userId;
    const body = ProfileController.updateReqBody(req, userId);

    return Profile.findOne({
      where: { id: req.params.id },
    })
      .then((profile) => {
        if (profile) {
          return profile.update(body);
        }
        return null;
      })
      .then((profile) => {
        if (profile) {
          return res.status(200).json({ success: true, message: 'Profile updated successfully', profile });
        }
        return res.status(404).json({ success: false, message: 'Profile not found', profile });
      })
      .catch(err => res.status(500).json({ error: 'Profile could not be updated' }));
  }

  /**
  * @description -This method add profile image url and userid to payload object
  * @param {object} req - The request payload sent from the router
  * @param {object} userId - user of the logged in user
  * @returns {object} - object contain userid and profile image url
  */
  static updateReqBody(req, userId) {
    const data = Object.assign(
      {},
      {
        profileImage: req.file ? req.file.secure_url : '',
        userId
      },
      req.body,
    );

    if (!data.profileImage) {
      delete data.profileImage;
    }

    return data;
  }
}
