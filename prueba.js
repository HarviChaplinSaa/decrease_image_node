const sharp = require('sharp')
const fs = require('fs')

    const urlFuente = './imagesTemp'

    const transformImages = (fuente, destino) =>{
        fs.readdir(fuente, function (err, archivos) {
            if(err) return console.log('Error al leer carpeta: ', err)    
            archivos.forEach( async (nombreArchivo) => {
                fs.lstat(`${fuente}/${nombreArchivo}`, async (err, stats) => {
                    if(err) return console.log('Error al validar archivo: ',err)
                    if(stats.isDirectory()){
                        transformImages(`${fuente}/${nombreArchivo}`, `${destino}/${nombreArchivo}`)
                    }else{
                        let fileSizeInMegabytes = (fs.statSync(`${fuente}/${nombreArchivo}`).size) / (1024*1024);
                        if(fileSizeInMegabytes> 0.5){
                            try{
                                const imageDimensions = await sharp(`${fuente}/${nombreArchivo}`).metadata()
                                const image = await sharp(`${fuente}/${nombreArchivo}`).resize(imageDimensions.width > imageDimensions.height ? {width: 600} : {height: 600}).toFormat('jpg').jpeg({quality:100}).toBuffer();
                                fs.writeFileSync(`${destino}/${nombreArchivo}`, image)
                                console.log('Imagen: ',nombreArchivo,' convertida con exito');
                            } catch (err2) {
                                console.log('La imagen: ',nombreArchivo,' no se pudo convertir, causa del error: ',err2);
                            }
                        }else{
                            console.log('Imagen: ',nombreArchivo,' no se pudo convertir, causa del error: su tamaño ya es muy pequeño ');
                        }
                    }

                })
            });
        })
    }

    transformImages(urlFuente, urlFuente)


