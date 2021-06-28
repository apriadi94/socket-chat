const router = require('express').Router()
const moment = require('moment')
const sizeOf = require('image-size')
const compress_images = require("compress-images");
const fs = require('fs')


router.route('/')
    .post(async (req, res) => {
        const file = req.files.image
        const path = `${__dirname}/../../upload/${moment().format('dd-MM-YYYY-hh-mm-ss')}_${file.name}`
        const fileName = `${moment().format('dd-MM-YYYY-hh-mm-ss')}_${file.name}`

        file.mv(path, err => {
            if (err) {
                console.log(err)
                res.send('There is error')
            } else {
                
                sizeOf(path, function (err, dimensions) {
                    const width = dimensions.width > 1800 ? dimensions.width/2 : dimensions.width
                    const height = dimensions.height > 1800 ? dimensions.height/2 : dimensions.height


                    compress_images(
                        path, "upload/img/",
                        { compress_force: false, statistic: true, autoupdate: true },
                        false,
                        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                        { svg: { engine: "svgo", command: "--multipass" } },
                        {
                            gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
                        },
                        function (err, completed) {
                            if (completed === true) {
                                try {
                                    fs.unlinkSync(path)
                                    //file removed
                                  } catch(err) {
                                    console.error(err)
                                  }
                                res.send({
                                    data: fileName,
                                    width: dimensions.orientation === 6 ? height : width ,
                                    height: dimensions.orientation === 6 ? width : height 
                                })
                            }
                        }
                        );
                  })
                
            }
        })
        
    })
    

module.exports = router
