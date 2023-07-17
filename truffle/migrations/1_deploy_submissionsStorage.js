const SubmissionsStorage = artifacts.require("SubmissionsStorage");

module.exports = function (deployer) {
  deployer.deploy(SubmissionsStorage);
};