var mongoose = require('mongoose');
var Loc = mongoose.model('Location');



var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};


//router.post('/locations/:locationid/reviews', ctrlReviews.reviewsCreate);
module.exports.reviewsCreate = function(req,res) {
    var locationid = req.params.locationid;
    if (locationid) {
        Loc
            .findById(locationid)
            .select('reviews')
            .exec(
            function(err, location) {
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    doAddReview(req, res, location);
                }
            }
        );
    } else {
        sendJsonResponse(res, 404, {"message": "Not found, locationid required"});
    }
};

//router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
module.exports.reviewsReadOne = function(req,res) {
    if(req.params && req.params.locationid && req.params.reviewid) {
        Loc.findById(req.params.locationid).select('name reviews').exec(function(err, location) {
            var response, review, notfoundmsg;
            lnotfoundmsg = {"message": "locationid not found"};
            rnotfoundmsg = {"message": "reviewid not found"};
            if (!location) {
                sendJsonResponse(res, 404, lnotfoundmsg);
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            if (location.reviews && location.reviews.length > 0) {
                review = location.reviews.id(req.params.reviewid);
                console.log(review);
                if (!review) {
                    sendJsonResponse(res, 404, rnotfoundmsg);
                } else {
                    response = {
                        location: {
                            name: location.name,
                            id: req.params.locationid
                        },
                        review: review
                    };
                    sendJsonResponse(res, 200, response);
                }
            } else {
                sendJsonResponse(res, 404, {"message": "No reviews found"});
            }
        });
    } else {
        sendJsonResponse(res, 404, {"message": "No locationid in request"}); 
    }
};

//router.put('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
module.exports.reviewsUpdateOne = function(req,res) {
    sendJsonResponse(res, 200, {"status" : "success"});
}
//router.delete('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);
module.exports.reviewsDeleteOne = function(req,res) {
    sendJsonResponse(res, 200, {"status" : "success"});
}
