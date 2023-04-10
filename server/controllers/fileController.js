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
}

module.exports = new FileController();
