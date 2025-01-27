function notFoundError(req , res , next){
    return res.status(404).send({
        statusCode: err.statusCode,
        error: {
            type: "notFound",
            message: `Not Found ${req.url} route`
        }
    })
}
function errorHandler(err , req , res , next){
    return res.json({
        statusCode: req.statusCode,
        error: {
            message: err.message ?? "InternalServerError"
        }
    })
}

module.exports = {
    notFoundError,
    errorHandler
}