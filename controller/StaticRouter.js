const PrintRequest = require("../model/PrintRequest");
const ShopKeeper = require("../model/Shopkeeper");
async function getPrintDetails(req, res){
    try{
        console.log(req.params);
        const  {requestId}  = req.params;

        const printRequest = await PrintRequest.findById(requestId);

        if(!printRequest){
            return res.status(400).json({message: "Request Not Found"});
        }

        res.status(200).json({
            encryptedData: printRequest.encryptedData,
            encryptedKey: printRequest.encryptedKey,
            fileNames: printRequest.fileNames,
            pages: printRequest.pages,
            printMode: printRequest.printMode,
            copies: printRequest.copies,
            fileNames: printRequest.fileNames
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

async function getNearByShops(req, res){
    try {
        const { lat, lng, maxDistance = 5000 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: "Latitude and Longitude are required." });
        }

        const nearbyShopkeepers = await ShopKeeper.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        });

        res.status(200).json(nearbyShopkeepers);
    } catch (error) {
        console.error("Error fetching shopkeepers:", error);
        res.status(500).json({ error: error.message });
    }

    
};
module.exports = {
    getPrintDetails,
    getNearByShops
};