
const readFile = (req, res, next) => {
    const key = `/${req.params[0]}`;
    const params = {
        Bucket: S3_BUCKET,
        key: key,
    };

    s3.headObject(params, function(err, data) {
        if(err) {
            console.error(err);
            if(err.code === 'NotFound') {
                return next(Boom.notFound());
            }
            return next(Boom.badImplementation('Unable to retrieve file'));
        }

        const stream = s3.getObject(params).createReadStream();

        stream.on('error', function error(err) {
            console.error(err);
            return next(Boom.badImplementation());
        });

        res.set('Content-Type', data.ContentType);
        res.set('Content-Length', data.ContentLength);
        res.set('Last-Modified', data.LastModified);
        res.set('Content-Disposition', `inline; filename="${data.Metadata.originalname}"`);
        res.set('ETag', data.ETag);

        stream.pipe(res);
    });
}