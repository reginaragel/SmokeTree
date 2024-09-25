const mongoose=require('mongoose');
const {Schema,model}=mongoose;

const DetailsSchema=new Schema({
    name:String,
    address:String,
    
})

const DetailsModel=model('Detail',DetailsSchema);

module.exports=DetailsModel;