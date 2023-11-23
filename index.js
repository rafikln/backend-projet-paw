import express from "express";
const app = express();
import nodemailer from "nodemailer";
import { etudientModel } from "./Schema-base-donne/etudient.js";
import { recoursModel } from "./Schema-base-donne/recours.js";
import { connectDB } from "./Connect-base-donne/db.js";
import cors from "cors";
app.use(cors());
connectDB()
  .then(() => {
    console.log("connect to mongo DB");
  })
  .catch((e) => {
    console.error(e.message);
  });
let transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: "contact@dgl-dz.info",
    pass: "Rafik100",
  },
});
app.use(express.json());

app.post("/recours", async (req, res) => {
  try {
    const etudientData = req.body;
    const utdn = await etudientModel.findOne({
      matricule: etudientData.matricule,
    });

    if (!utdn) {
      const etudient = new etudientModel({
        matricule: etudientData.matricule,
        nom: etudientData.nom,
        prenom: etudientData.prenom,
        email: etudientData.email,
        groupe: etudientData.groupe,
      });

      const userr = await etudient.save();
      const recours = new recoursModel({
        idEtudient: userr,
        matricule: etudientData.matricule,
        module: etudientData.module,
        nature: etudientData.nature,
        note_affiche: etudientData.note_affiche,
        note_reel: etudientData.note_reel,
        status: etudientData.status,
      });
      await recours.save();

      res.status(201).json({
        message: "on ajout que le recours",
      });
      return;
    }
    const userr = await etudientModel.findOne({
      matricule: etudientData.matricule,
    });
    const recours = new recoursModel({
      idEtudient: userr._id,
      matricule: etudientData.matricule,
      module: etudientData.module,
      nature: etudientData.nature,
      note_affiche: etudientData.note_affiche,
      note_reel: etudientData.note_reel,
      status: etudientData.status,
    });
    await recours.save();

    //  const rec = await recoursModel.find({}).populate("idEtudient")
    res.status(201).json({
      message: "one pas ajouter etudient",
    });
  } catch (e) {
    console.error(e.message);
  }
});
app.get("/liste", async (req, res) => {
  try {
    const rec = await recoursModel.find().populate("idEtudient");

    res.status(200).json(rec);
  } catch (e) {
    console.error(e.message);
  }
});
app.post("/status", async (req, res) => {
  const data = req.body;
  const e = await recoursModel.findOne({ _id: data._id });

  const updatedRecours = await recoursModel.findOneAndUpdate(
    { _id: data._id },
    { $set: { status: !e.status } }
  );
  res.status(200).json(updatedRecours);
});
app.post("/mail", async (req, res) => {
  const data = req.body;
  const e = await recoursModel
    .findOne({ _id: data._id })
    .populate("idEtudient");

  if (e.status == true) {
    transporter.sendMail(
      {
        from: "contact@dgl-dz.info",
        to: e.idEtudient.email,
        subject: `Domande recours  ${e.module}`,
        html: `
          <div>
            <p style="
              font-family: sans-serif;
              text-align: center;
              font-size: 20px;
              background-color: rgb(47, 214, 47);
              color: white;
              border-radius: 8px;
              font-weight: 600;
              padding: 3px;
            ">
              Votre Note est à changé
            </p>
            <span style="font-family: sans-serif; font-size: 17px">
            Matricule :
          </span>
          <span style="color: gray; font-family: sans-serif";
          color: rgb(21, 43, 211);>${e.matricule} </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px">
            Nom et Prénom :
          </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif">
            ${e.idEtudient.nom}   ${e.idEtudient.prenom}
          </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px"> Groupe : </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif">${e.idEtudient.groupe} </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px"> Module : </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif">
           ${e.module}
          </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px"> Nature : </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif"> ${e.nature} </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px">
            Note Affiché :
          </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif"> ${e.note_affiche}</span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px">
            Note Réel :
          </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif"> ${e.note_reel}</span>
          </div>
          <p style="
            text-align: center;
            font-family: sans-serif;
            color: rgb(111, 111, 111);
            font-size: 14px;
          ">
            Développé par Groupe DGL©2023 DGL
          </p>
        `,
      },
      (errore) => {
        if (errore) return console.error(errore);
        console.log("mail note errore");
      }
    );
  }
  if (e.status == false) {
    transporter.sendMail(
      {
        from: "contact@dgl-dz.info",
        to: e.idEtudient.email,
        subject: `Domande recours ${ e.module}`,
        html: `
          <div>
            <p style="
              font-family: sans-serif;
              text-align: center;
              font-size: 20px;
              background-color: red;
              color: white;
              border-radius: 8px;
              font-weight: 600;
              padding: 3px;
            ">
              Votre Note n'pas changè
            </p>
            <span style="font-family: sans-serif; font-size: 17px">
            Matricule :
          </span>
          <span style="color: gray; font-family: sans-serif";
          color: rgb(21, 43, 211);>${e.matricule} </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px">
            Nom et Prénom :
          </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif">
            ${e.idEtudient.nom}  ${e.idEtudient.prenom}
          </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px"> Groupe : </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif">${e.idEtudient.groupe} </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px"> Module : </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif">
           ${e.module}
          </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px"> Nature : </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif"> ${e.nature} </span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px">
            Note Affiché :
          </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif"> ${e.note_affiche}</span>
          <br />
          <span style="font-family: sans-serif; font-size: 17px">
            Note Réel :
          </span>
          <span style="color: rgb(21, 43, 211); font-family: sans-serif"> ${e.note_reel}</span>
          </div>
          <p style="
            text-align: center;
            font-family: sans-serif;
            color: rgb(111, 111, 111);
            font-size: 14px;
          ">
            Développé par Groupe DGL©2023 DGL
          </p>
        `,
      },
      (errore) => {
        if (errore) return console.error(errore);
        console.log("mail note errore");
      }
    );
  }

  res.status(200).json({
    message: "c",
  });
});
app.listen("3001", (e) => {
  console.log(" server listening on port 3001");
});
