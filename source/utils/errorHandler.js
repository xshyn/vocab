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
        statusCode: err?.statusCode || 500,
        error: {
            message: err?.message ?? "InternalServerError"
        }
    })
}

module.exports = {
    notFoundError,
    errorHandler
}