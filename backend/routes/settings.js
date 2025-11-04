const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// @route   GET /api/settings
// @desc    Get system settings
// @access  Private
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ isDefault: true });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({
        isDefault: true,
        emailTemplates: {
          welcomeEmail: {
            subject: 'Welcome to {{companyName}}!',
            body: getDefaultWelcomeEmail()
          },
          leaveRequest: {
            subject: 'Leave Request from {{employeeName}}',
            body: getDefaultLeaveRequestEmail()
          },
          leaveApproval: {
            subject: 'Your Leave Request has been Approved',
            body: getDefaultLeaveApprovalEmail()
          },
          leaveRejection: {
            subject: 'Your Leave Request has been Rejected',
            body: getDefaultLeaveRejectionEmail()
          },
          passwordReset: {
            subject: 'Password Reset Request',
            body: getDefaultPasswordResetEmail()
          },
          salarySlip: {
            subject: 'Your Salary Slip for {{month}}',
            body: getDefaultSalarySlipEmail()
          },
          performanceReview: {
            subject: 'Performance Review Reminder',
            body: getDefaultPerformanceReviewEmail()
          },
          exitAcceptance: {
            subject: 'Resignation Acceptance',
            body: getDefaultExitAcceptanceEmail()
          }
        }
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error fetching settings' });
  }
});

// @route   PUT /api/settings
// @desc    Update system settings
// @access  Private (Admin only)
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ isDefault: true });
    
    if (!settings) {
      settings = new Settings({ isDefault: true });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        settings[key] = req.body[key];
      }
    });
    
    settings.updatedAt = Date.now();
    await settings.save();
    
    console.log('⚙️  SETTINGS UPDATED:');
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');
    
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error updating settings' });
  }
});

// Default Email Templates
function getDefaultWelcomeEmail() {
  return `Dear {{employeeName}},

Welcome to {{companyName}}! We are thrilled to have you join our team.

Your employee ID is: {{employeeId}}
Department: {{department}}
Role: {{role}}

Your login credentials have been set up, and you can access the HR portal using your email address. Please change your password upon first login for security purposes.

Should you have any questions or need assistance during your onboarding, please don't hesitate to reach out to the HR department.

We look forward to working with you and wish you great success in your new role!

Best regards,
HR Department
{{companyName}}

---
This is an automated email. Please do not reply to this message.`;
}

function getDefaultLeaveRequestEmail() {
  return `Dear Admin/HR,

A new leave request has been submitted and requires your attention.

Employee Details:
- Name: {{employeeName}}
- Employee ID: {{employeeId}}
- Department: {{department}}

Leave Request Details:
- Leave Type: {{leaveType}}
- Start Date: {{startDate}}
- End Date: {{endDate}}
- Total Days: {{totalDays}}
- Reason: {{reason}}

Please review and approve/reject this request at your earliest convenience through the HR Portal.

Best regards,
HR Management System
{{companyName}}

---
This is an automated email. Please do not reply to this message.`;
}

function getDefaultLeaveApprovalEmail() {
  return `Dear {{employeeName}},

We are pleased to inform you that your leave request has been approved.

Leave Details:
- Leave Type: {{leaveType}}
- Start Date: {{startDate}}
- End Date: {{endDate}}
- Total Days: {{totalDays}}

Please ensure a smooth handover of your responsibilities before your leave begins. If you have any questions, feel free to contact HR.

Enjoy your time off!

Best regards,
HR Department
{{companyName}}

---
This is an automated email. Please do not reply to this message.`;
}

function getDefaultLeaveRejectionEmail() {
  return `Dear {{employeeName}},

We regret to inform you that your leave request has been rejected.

Leave Details:
- Leave Type: {{leaveType}}
- Start Date: {{startDate}}
- End Date: {{endDate}}
- Total Days: {{totalDays}}

Reason for Rejection: {{rejectionReason}}

If you have any concerns or would like to discuss this further, please contact HR department.

Best regards,
HR Department
{{companyName}}

---
This is an automated email. Please do not reply to this message.`;
}

function getDefaultPasswordResetEmail() {
  return `Dear {{employeeName}},

We received a request to reset your password for the HR Portal account.

Your temporary password is: {{temporaryPassword}}

For security reasons, please log in and change your password immediately.

If you did not request this password reset, please contact the HR department immediately.

Best regards,
HR Department
{{companyName}}

---
This is an automated email. Please do not reply to this message.`;
}

function getDefaultSalarySlipEmail() {
  return `Dear {{employeeName}},

Your salary slip for {{month}} is now available.

Salary Details:
- Basic Salary: {{basicSalary}}
- Allowances: {{allowances}}
- Deductions: {{deductions}}
- Net Salary: {{netSalary}}

Please find the detailed salary slip attached to this email. For any queries regarding your salary, please contact the HR or Finance department.

Best regards,
HR & Finance Department
{{companyName}}

---
This is an automated email. Please do not reply to this message.`;
}

function getDefaultPerformanceReviewEmail() {
  return `Dear {{employeeName}},

This is a friendly reminder that your performance review is scheduled.

Review Details:
- Review Period: {{reviewPeriod}}
- Scheduled Date: {{reviewDate}}
- Reviewer: {{reviewerName}}

Please prepare the following:
1. Self-assessment of your achievements
2. Goals accomplished during the review period
3. Areas for improvement and professional development goals
4. Any challenges faced and how you overcame them

If you have any questions or need to reschedule, please contact your manager or HR department.

Best regards,
HR Department
{{companyName}}

---
This is an automated email. Please do not reply to this message.`;
}

function getDefaultExitAcceptanceEmail() {
  return `Dear {{employeeName}},

We acknowledge receipt of your resignation letter and accept your resignation from the position of {{role}} at {{companyName}}.

Exit Details:
- Last Working Day: {{lastWorkingDay}}
- Notice Period: {{noticePeriod}}
- Exit Interview Date: {{exitInterviewDate}}

Please complete the following before your last working day:
1. Handover of all responsibilities and projects
2. Return company property (ID card, laptop, access cards, etc.)
3. Complete exit formalities with HR
4. Attend the exit interview
5. Clear all pending dues

We appreciate your contributions during your tenure with us and wish you all the best in your future endeavors.

Your experience certificate and other documents will be processed and shared with you post completion of exit formalities.

Best regards,
HR Department
{{companyName}}

---
This is an automated email. Please do not reply to this message.`;
}

module.exports = router;
