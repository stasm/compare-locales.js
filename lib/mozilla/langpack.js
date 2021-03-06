'use strict';

var Promise = require('promise');
var path = require('path');
var utils = require('./utils');

function Langpack(uri, localeCode, basePath) {
  this.uri = uri;
  this.code = localeCode;
  this.path = basePath;
  this.type = {
    app: 'gaia',
    structure: 'source'
  };
}

Langpack.prototype.addResources = function(pathBuilder, resources) {
  var loc = this.code;

  return this.resources = resources.then(function(resIds) {
    var resources = Object.create(null);
    resIds.forEach(function(resId) {
      var resPath = pathBuilder(loc ? resId.replace('{locale}', loc) : resId);
      if (utils.fileExists(resPath)) {
        resources[resId] = new Resource(resId, resPath);
      }
    });
    return resources;
  });
};

function Resource(id, resPath) {
  this.id = id;
  this.path = resPath;
}

function getLangpackFromDir(path1, locale) {
  var relative = path.relative.bind(null, path1);
  // XXX imitate an async utils.ls
  var resPaths = new Promise(function(resolve) {
    var absPaths = utils.ls(path1, true, /\.(properties|l20n)$/);
    resolve(absPaths.map(relative));
  });

  return getLangpackFromPaths(resPaths, path1, locale);
}

function getLangpackFromPaths(paths, dir, locale) {
  var pathBuilder = path.resolve.bind(null, dir);

  var lp = new Langpack(null, locale, dir);
  lp.addResources(pathBuilder, paths);
  return lp;
}

exports.Langpack = Langpack;
exports.Resource = Resource;
exports.getLangpackFromDir = getLangpackFromDir;
exports.getLangpackFromPaths = getLangpackFromPaths;
