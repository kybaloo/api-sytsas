const Horaire = require('../models/horaireModel');
const Entraineur = require('../models/entraineurModel');
const Salle = require('../models/salleModel');
const crudController = require('./crudController');


exports.getAllHoraires = crudController.getAll(Horaire);
exports.getHoraire = crudController.getOne(Horaire, [
  { path: 'entraineur', select: 'nom prenom specialite' },
  { path: 'salle', select: 'nom numero_salle' }
]);
exports.createHoraire = crudController.createOne(Horaire);
exports.updateHoraire = crudController.updateOne(Horaire);
exports.deleteHoraire = crudController.deleteOne(Horaire);




exports.getHorairesBySalle = async (req, res) => {
  try {
    const { salleId } = req.params;
    
    
    const salle = await Salle.findById(salleId);
    if (!salle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Salle non trouvée'
      });
    }
    
    
    const horaires = await Horaire.find({ salle: salleId, actif: true })
      .populate('entraineur', 'nom prenom specialite')
      .sort({ jour: 1, debut: 1 });
    
    res.status(200).json({
      status: 'success',
      count: horaires.length,
      data: horaires
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};


exports.getHorairesByJour = async (req, res) => {
  try {
    const { jour } = req.params;
    
    
    const joursValides = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    if (!joursValides.includes(jour)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Jour invalide. Les jours valides sont: ' + joursValides.join(', ')
      });
    }
    
    
    const horaires = await Horaire.find({ jour, actif: true })
      .populate('entraineur', 'nom prenom specialite')
      .populate('salle', 'nom numero_salle')
      .sort({ debut: 1 });
    
    res.status(200).json({
      status: 'success',
      count: horaires.length,
      data: horaires
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};


exports.activerHoraire = async (req, res) => {
  try {
    const horaire = await Horaire.findById(req.params.id);
    
    if (!horaire) {
      return res.status(404).json({
        status: 'fail',
        message: 'Horaire non trouvé'
      });
    }
    
    horaire.actif = true;
    await horaire.save();
    
    res.status(200).json({
      status: 'success',
      data: horaire
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.desactiverHoraire = async (req, res) => {
  try {
    const horaire = await Horaire.findById(req.params.id);
    
    if (!horaire) {
      return res.status(404).json({
        status: 'fail',
        message: 'Horaire non trouvé'
      });
    }
    
    horaire.actif = false;
    await horaire.save();
    
    res.status(200).json({
      status: 'success',
      data: horaire
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
}; 
