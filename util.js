
var _ = require('underscore');

var Util = function () {
  
  var buildObj = function (data, print) {
    if (data instanceof Error)
      return false;

    var printObj = function(dataObj) {
      for (var key in dataObj)
        console.log(key + ':' + dataObj[key]);
    }

    var packageObj = {
      name: data.name,
      description: data.description,
      readme: data.readme,
      author: data.author,
      repo_type: data.repository === undefined ? '' : data.repository.type,
      repo_url: data.repository == undefined ? '' : data.repository.url,
      versions: []
    };
    // printObj(packageObj);

    _.each(data.versions, function(elem, index, list) {
      var objVer = {
        name: elem.name,
        version: elem.version,
        description: elem.description,
        tags: elem.keywords, // an array
        readme: {
          content: elem.readme,
          file: elem.readmeFilename
        }
      };
      packageObj.versions.push(objVer);
    });
    packageObj.maintainers = data.maintainers === undefined ? [] : data.maintainers; // another array of objects {name, email}

    if (print)
      console.log(index + ": " + packageObj.name + "("+packageObj.author+")");

    return packageObj;
  };


  var selectPackages = function (listPackages, print) {
    var selPackages = [];
    if (print)
      console.log("Chosen 100 out of " + listPackages.length + "(" + listPackages[46] + " - " + listPackages[29847] + ")");

    for (var i = 0; i < 100; i++) {
      var selIndex = Math.random() * listPackages.length - 1;
      selIndex = Math.round(selIndex);
      var selPack = listPackages[selIndex];
      if (print)
        console.log("Package chosen: " + selPack + " for " + selIndex);
      selPackages.push(selPack);
    }

    return selPackages;
  };

  return {
    buildObj: buildObj,
    selectPackages: selectPackages
  }

}


module.exports = Util;