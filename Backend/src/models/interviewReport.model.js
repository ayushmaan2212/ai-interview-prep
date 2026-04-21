const mongoose = require('mongoose');

/**
 * job description schema:String
 * resume text : String
 * self description : String
 * 
 * match score : Number
 * 
 * - technical questions :[{
 *      question : String,
 *      intention:String ,
 *      answer : String
 *   }]
 * - behavioral questions :[{
 *      question : String,
 *      intention:String ,
 *      answer : String
 *   }]
 * - skills gap :[{
 *      skill:"",
 *      severity:{
 *          type : String,
 *          enum : ['low','medium','high']
 *      }
 *  }]
 * - prepration plan : [{
 *      day : Number,
 *      focus : String,
 *      tasks : [String]
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Technical question is required']
    },
    intention: {
        type: String,
        required: [true, 'Intention is required']
    },
    answer:{
        type: String,
        required: [true, 'Answer is required']
    }
},{ _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Technical question is required']
    },
    intention: {
        type: String,
        required: [true, 'Intention is required']
    },
    answer:{
        type: String,
        required: [true, 'Answer is required']
    }
},{_id: false });

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Skill is required']
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, 'Severity is required'],
        set: (val) => val.toLowerCase()
    }
},{_id: false });

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, 'Day is required']
    },
    focus:{
        type: String,
        required: [true, 'Focus is required']
    },
    tasks:[{
        type: String,
        required: [true, 'At least one task is required']
    }] 
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, 'Job description is required']
    },
    resume:{
        type: String,
    },
    selfDescription:{
        type: String
    },
    matchScore:{
        type : Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillsGap:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    }
}, { timestamps: true });

const InterviewReport = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReport;