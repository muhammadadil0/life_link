const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  blood_type: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  units_needed: {
    type: Number,
    default: 1,
    min: 1
  },
  urgency: {
    type: String,
    enum: ['Critical', 'High', 'Moderate', 'Planned'],
    default: 'Critical'
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Urgent', 'In Progress', 'Fulfilled'],
    default: 'Urgent'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
