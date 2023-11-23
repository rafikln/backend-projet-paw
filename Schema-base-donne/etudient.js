import mongoose from "mongoose";
const etudientSchema = new mongoose.Schema({
  matricule: {
    type: Number ,
  },
  nom: {
    type: "String",
  },
  prenom :
  {
    type: "String",
  },
  email :
  {
    type: "String",
  },
  groupe :
  {
    type: "String",
  }
});
etudientSchema.methods.toJSON = function()
{
    const etudiantObj=this.toObject();
    delete etudiantObj.__v;
    return etudiantObj;
}
export const etudientModel = mongoose.model("etudient",etudientSchema);
