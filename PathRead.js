let fs = require('fs')
let extraStat = require('@mixint/extrastat')
let Transflect = require('@mixint/transflect')

/**
 * @extends Transflect
 * PathRead opens a file via the full URL pathname (starting at system root)
 * Before sending the file it calls `mimemap.extraStat` to write informative
 * headers, including MIME type and access permisions + owner
 */
module.exports = class PathRead extends Transflect {
    constructor(opt){
        super(opt)
    }

    /**
     * @param {parsedmessage} source
     * @return {ReadStream}
     * gets called once a source is piped to Transflect, registers a fs readstream
     */
    _open(source){
        return this.stream = fs.createReadStream(source.pathname)
    }

    /**
     * Holds the connection open, doesn't send any bytes until fs.stat returns info
     * Sets headers, then switches `this.stream` on to flow directly to the destination,
     * this.pipes is a reference to the ServerFailSoft (http.ServerResponse)
     */
    _flush(done){
        extraStat(this.stream.path, (error, stat) => {
            if(error) return this.destroy(error)
            this.writeHead(200, {
                'Content-Length': stat.filestat.size,
                'Content-Type'  : stat.mimetype,
                'x-Content-Mode': stat.filemode,
                'x-Mode-Owner'  : stat.filestat.uid,
                'x-Mode-Group'  : stat.filestat.gid
            })

            this.stream.on('data', data => {
                this.push(data) || (this.stream.pause(), this.pipes.once('drain', () => this.stream.resume()))
            }).on('error', done).on('end', done)
        })
    }
}
