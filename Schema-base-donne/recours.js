import mongoose from "mongoose";
const recoursSchema = new mongoose.Schema({
     idEtudient: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "etudient", 
  },
  matricule :
  {
    type :"string"
    
  },
  module :
  {
    type :"string"
    
  },
  nature :
  {
    type :"string"
  },
  note_affiche :
  {
type : Number,
  },
  note_reel :
  {
    type : Number,

  },
  status :
  {
    type : Boolean,

  }

});
recoursSchema.methods.toJSON = function()
{
    const recoursObj=this.toObject();
    delete recoursObj.__v;
    return recoursObj;
}
export const recoursModel = mongoose.model("recours",recoursSchema);
