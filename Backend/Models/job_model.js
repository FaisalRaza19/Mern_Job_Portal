import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    location: {
      type: String,
    },
    salary: {
      min_salary: {
        type: Number,
        required: true,
      },
      max_salary: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["Entry", "Mid", "Senior", "Lead"],
      default: "Entry",
    },
    Requirements : {
      type : String,
      required : true,
    },
    skillsRequired: {
      type: Array,
      required: true,
    },
    openings: {
      type: Number,
      default: 1,
    },
    applicationDeadline: {
      type: Date,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        resumeUrl: String,
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["Pending", "Shortlisted", "Rejected", "Hired"],
          default: "Pending",
        },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Closed", "Pause"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);