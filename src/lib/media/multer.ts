import multer, {memoryStorage} from "multer" ;
export function multerUpload (){
    multer({
        storage: memoryStorage() 
        // او disStorage({}) بس دي بتاخد {options}  ومش لازم نقولها الاوبيشنز 
    });
}

export function multerUploadSingle(fieldName: string) {
   return multerUploadSingle(fieldName)

}
export function multerUploadArray(fieldName: string ,maxCount: number ){
    return multerUploadArray(fieldName, maxCount)
}