# Project Plan

This document outlines the project plan for the student task tracking system proposed by the client. 

The client requires an application for teachers to mark group work fairly by monitoring time, work done and student progress. The application is required to be accessible to the client, irrespective of the device. It will need to provide tools for the teacher to create different groups/projects and monitor data, with helpful graphical representation. (Charts, Graphs) .

Further, it must also provide an intuitive interface for the students to input data, so that proper records are maintained. 

**Deliverables**

Sep 4 : 
* Project Plan
* Analysis of Alternatives
* Risk Register

We plan to deliver working features after each sprint, the exact nature of which will be decided according to the sprint backlog of the relevant sprint.

**Vision statement**

We will create a student task/time tracking system for teachers who need to mark group work fairly to monitor their students’ progress online. Unlike most other products, our product uses a simplistic, intuitive user interface for optimal user experience.

**Team members and roles**


<table>
  <tr>
   <td rowspan="2" >Member
   </td>
   <td rowspan="2" >Contact details
   </td>
   <td colspan="3" >Role
   </td>
  </tr>
  <tr>
   <td>Management
   </td>
   <td>Development
   </td>
   <td>QA/Testing
   </td>
  </tr>
  <tr>
   <td>Jacqueline Ka Thum
   </td>
   <td>kthu0005@student.monash.edu
   </td>
   <td>
   </td>
   <td>Yes
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Joseph Loo
   </td>
   <td>jloo0017@student.monash.edu
   </td>
   <td>
   </td>
   <td>Yes
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>Jun Xiang
   </td>
   <td>jchu0046@student.monash.edu
   </td>
   <td>
   </td>
   <td>Yes
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Sadeeptha Bandara
   </td>
   <td>hban0006@student.monash.edu
   </td>
   <td>Yes
   </td>
   <td>Yes
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Zhe Sheng Lim
   </td>
   <td>zlim0027@student.monash.edu
   </td>
   <td>Yes
   </td>
   <td>Yes
   </td>
   <td>Yes
   </td>
  </tr>
</table>


The following responsibilities are assigned to the team members. Team members will look into the status of the backlog items relevant to the following.


<table>
  <tr>
   <td><span style="text-decoration:underline;">Q/A</span>
<p>
Zhe Sheng 
<p>
Joseph Loo
   </td>
  </tr>
  <tr>
   <td><span style="text-decoration:underline;">Development</span>
<p>
	JavaScript  :  
<p>    
             
* Sadeeptha
* Chuang
* Jacqueline
* Joseph

<p>
 Main Logic   : 
<p>

* Sadeeptha

<p>
	UI                 :  
<p>

* Zhe Sheng

   </td>
  </tr>
</table>





**Process Model**

Basis: Scrum

The basis for the team’s process model is scrum. While the basic principles of scrum are followed, certain modifications have been made taking into account the nature of the project, context within which the project is worked on, team member requests. 

The modifications are as follows.

Modifications:


<table>
  <tr>
   <td>Scrum Aspect
   </td>
   <td>Variation(s)
   </td>
   <td>Explanation
   </td>
  </tr>
  <tr>
   <td>Product Backlog management
   </td>
   <td>Trello and GitLab are used as backlog management tools.
   </td>
   <td>The sprint and the product backlog must be maintained, so that teammates can check on progress. A software is required for this, as the team is not co-located.
   </td>
  </tr>
  <tr>
   <td>Sprint Planning Meeting
   </td>
   <td>Once per two weeks, first Monday of Sprint
   </td>
   <td>At the start of each sprint, items from the product backlog can be transferred 
   </td>
  </tr>
  <tr>
   <td>Daily Standup
   </td>
   <td>Changed to once per two days
   </td>
   <td>Formal check for progress can be done via Whatsapp or other apps. Teammates can also update their status informally.
   </td>
  </tr>
  <tr>
   <td>Sprint Review
   </td>
   <td>Once every week
   </td>
   <td>Will be done weekly during the sprint
   </td>
  </tr>
  <tr>
   <td>Product Review
   </td>
   <td>Once every two weeks
   </td>
   <td>Every alternate Fridays, a meeting will be held with the client to review status of product
   </td>
  </tr>
  <tr>
   <td>Sprint Retrospective
   </td>
   <td>Once per two weeks, after Sprint Review
   </td>
   <td>Team discusses what could be done better or what we have done right so as to improve/refine the team’s processes for future meetings.
   </td>
  </tr>
</table>




**Definition of Done**

For a task to be considered done, 



*   It needs to pass tests written
*   Needs to be approved by a Merge Request (preferably by a teammate who is responsible for the relevant backlog items)

While the above is the definition of done, in general, we expect the following criteria to be met, to consider a particular task as done.


<table>
  <tr>
   <td>Product Feature
   </td>
   <td>Requirements
   </td>
  </tr>
  <tr>
   <td>Graphical user interface
   </td>
   <td>Consistent design and layout across all pages.
   </td>
  </tr>
  <tr>
   <td>User login/signup
   </td>
   <td>Prompts users to login/signup every time the users want to use the application. Works without fail every single time.
   </td>
  </tr>
  <tr>
   <td>Admin/user access levels
   </td>
   <td>System is able to differentiate users by their access levels, provide the same features for users with the same access level, and hide features from those who are not authorized to access them.
   </td>
  </tr>
  <tr>
   <td>Data visualization
   </td>
   <td>Data visualization must be clear and easy to read; visualization must accurately reflect the data.
   </td>
  </tr>
  <tr>
   <td>Project management
   </td>
   <td>Admins are able to add projects successfully, and view all projects they are currently responsible to.
   </td>
  </tr>
  <tr>
   <td>Assign students to projects
   </td>
   <td>Admins are able to assign students to project teams. Admins can also remove students from project teams; task time data should be updated to reflect these changes.
   </td>
  </tr>
  <tr>
   <td>Task management and assignment
   </td>
   <td>Students are able to add tasks, assign themselves to tasks, and also remove themselves from tasks; task time data should be updated to reflect these changes.
   </td>
  </tr>
  <tr>
   <td>Task time input and update
   </td>
   <td>Students can input start and end time; all input errors are handled correctly. Task time data should be updated correctly to reflect these changes.
   </td>
  </tr>
  <tr>
   <td>Feedback
   </td>
   <td>Comment section exists for every project and task; users can add comments; comments are displayed properly and correctly.
   </td>
  </tr>
</table>


**Scrum Ceremonies/Procedure**

Sprint Planning will be done on the first Monday of each sprint, via Whatsapp and Discord.

Daily Scrum is changed to once every two days; work progress can be updated informally via messages on Whatsapp or Discord.

Sprint Review will be done on the second Friday of each sprint, during our team’s allocated tutorial session.

Sprint Retrospective will be done on the second Saturday of every sprint via video call.

**Task Allocation**

We will allocate tasks from our sprint backlog during the Sprint planning meeting at the beginning of each sprint, but tasks will not be fixed; team members have the freedom to cooperate on certain tasks.

Once the tasks are allocated, in Trello, the names are assigned at the bottom of the tasks they are assigned to indicate that they are the ones responsible for its completion.

Furthermore, the team mates who are responsible for a particular type of task, can ensure that help is provided to members.


**Progress Tracking**

Project progress will be tracked using GitLab, and will be updated from time to time by our team members.

We are also using a tool called Trello which keeps track of what needs to be done for the specific sprint.

Once it is completed, the task is moved to the ‘Done’ section to indicate that the team member has completed their task.

**Backlog Management**

Our backlogs will be managed through Trello. Members will update this document based on their progress throughout each sprint.

**Time Tracking**

Members will keep track of the time they spent on tasks via Trello. 

There will be a list specific to time logging. 

In the list there will be names of each of the members, and descriptions within them that state the tasks they’ve worked on or working on and the specific start and end times of said task.
