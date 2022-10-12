const Logger = require("../Logger");
const { Backup } = require("../models");
const RequestHandler = require("../RequestHandler");

module.exports = class BackupsController {
    static async saveBackup(req, res) {
        try {
            if (!req.body || Object.keys(req.body).length < 1) {
                RequestHandler.throwError(400, "Empty backup detected")();
            }

            const quantity = await Backup.countDocuments();
            if (quantity > 4) {
                const toDelete = await Backup.find()
                    .select("-data -date")
                    .limit(1);

                console.log("to delete-------", toDelete._id);

                const deletion = await Backup.deleteOne({
                    _id: toDelete[0]._id,
                });

                if (!deletion.acknowledged || deletion.deletedCount != 1) {
                    Logger.warn({
                        message:
                            "A problem was detected while deleting old backups",
                        deletion: deletion,
                    });
                }
            }

            const newBackup = new Backup({ data: req.body });

            const savedBackup = await newBackup.save();

            RequestHandler.sendSuccess(req.requestId, res, {
                isSuccessful: true,
            });
        } catch (error) {
            RequestHandler.sendError(req.requestId, res, error);
        }
    }

    static async restoreBackup(req, res) {
        try {
            const latestBackup = await Backup.find().limit(1).sort({ _id: -1 });
            if (!latestBackup) {
                Logger.warn(
                    "request for latest backup returned a falsey value"
                );
                RequestHandler.throwError(
                    404,
                    "request for latest backup returned a falsey value"
                )();
            } else if (latestBackup.length < 1) {
                Logger.warn(
                    "request for latest backup an empty array instead of one backup object"
                );
                RequestHandler.throwError(
                    404,
                    "request for latest backup returned an empty array instead of one backup object"
                )();
            }

            RequestHandler.sendSuccess(
                req.requestId,
                res,
                latestBackup[0].data
            );
        } catch (error) {
            RequestHandler.sendError(req.requestId, res, error);
        }
    }

    static async downloadBackup() {}
};
