const fileService = require('../services/fileService');
const File = require('../models/File');
const User = require('../models/User');

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent } = req.body;
      const file = new File({ name, type, parent, user: req.user.id });
      const parentFile = await File.findById(parent);
      if (!parentFile) {
        file.path = name;
        await fileService.createDir(file);
      } else {
        file.path = parentFile.path + '\\' + name;
        await fileService.createDir(file);
        parentFile.childs.push(file._id);
        await parentFile.save();
      }
      await file.save();
      return res.status(201).json(file);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  async getFiles(req, res) {
    try {
      const files = await File.find({ user: req.user.id, parent: req.query.parent });
      return res.json(files);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Can not get file' });
    }
  }
}

module.exports = new FileController();
