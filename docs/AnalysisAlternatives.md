# Analysis of Alternatives

A document for teammates to review the Programming Language, Platform and Tools available.

### Overview of the application and requirements:

The client requires an application for teachers to mark group work fairly by monitoring time, work done and student progress and will need to provide tools for the teacher to create different groups/projects and monitor data, with helpful graphical representation, while providing an intuitive interface for students.

The client requires an application that is accessible anywhere the client pleases and can be viewed easily, at his/her convenience.

### Platform

In line with the client’s requirements, we need to develop an application which can be accessed via any convenient device.

From the conversation with our client, we also recognized that the application must be able to store user information and group work time-related information. The application will require a backend database


_Main criteria_    -   

*   Accessibility
*   Requirement of backend


#### <span style="text-decoration:underline;"> Possibilities:</span>



##### 1. Web application

_Pros_:

*   Accessible via computer and mobile phone browsers - good cross-platform compatibility
*   Can be deployed easily
*   Most members are proficient in JavaScript; easier development
*   Backend database can be facilitated by the local storage for the domain of the web application.

_Cons_:



*   Hosting web applications may require a fee
*   Need to configure graphical interface to support different aspect ratios

##### 2. Mobile application (Android)

_Pros_:



*   Supports a more intuitive user interface
*   Optimized for mobile devices

_Cons_:



*   No cross-platform compatibility - app is dedicated to smartphones
*   Requires extensive knowledge of Java/Kotlin
*   The team does not have a common device to test the application on.

Mobile applications are considered as a possible solution, as mobile devices are easily accessible by the client, and can allow for convenient viewing of content.

However, mobile apps are limited to the mobile platform and limits the client from accessing the application on desktop and laptop devices. 

Therefore it is decided to make the application as a **web-based application**, which can be accessed via any of these devices, using Internet browsers. We would also like to find a free web hosting solution in order to deploy our application.

### Programming Language(s)

In line with the client’s requirements and the capabilities of our team members, we require a programming language that all team members are familiar with, and allows easy deployment to the web, as the client requires access to the application on both PC and mobile. The programming language chosen also needs to be capable of assisting with the presentation of graphical data, such as pie and bar charts.

In order to develop this application, we will require HTML to create web pages that act as a graphical user interface, as per the client’s requirements. HTML is a widely used markup language for websites, and is deemed most suitable for deploying our application, as it is highly compatible with JavaScript. CSS will be used to design our web page.

_Main criteria_ - 



*   Team mates’ familiarity with the language
*   Facilitates easy deployment on the web
*   Assists with presentation of graphical data
*   Compatibility with web technologies (HTML, CSS)



#### <span style="text-decoration:underline;">Core language choices:</span>



##### 1. Python

_Pros_:

*   Easy to develop with - all members have experience in Python
*   Supports Object-oriented programming
*   Will support graphical representation with useful libraries.

_Cons_:


*   Requires additional frameworks (such as Flask) to deploy to the web
*   Not as easy to integrate into web pages as JavaScript


##### 2. JavaScript

_Pros_:

*   Easy to integrate into web application
*   Supports Object Oriented programming
*   Capability to easily create dynamic web pages

_Cons_: 



*   Some members are not very familiar with JavaScript

Therefore, our language of choice is** JavaScript**, as it offers the same pros as Python while doing away with some of the cons.

As it is a web-based application, the Programming/markup language used will be 



*   HTML/CSS

	Pros:



*   Widely used for web pages
*   CSS allows for formatting web pages

Language of Choice: **HTML/CSS**

### Tools

We need a tool which has extensive support for the programming and/or markup languages we use to develop our application. 



1. <span style="text-decoration:underline;">Version Control</span>

Different version control systems are available. However, it is required that we use git for this project

The team will use git for version control, hosted on GitLab. It provides functionality to keep track of code changes, maintain different lines of development, as well as to keep track of issues, and set milestones.



2. <span style="text-decoration:underline;">IDEs</span>

Team members are allowed to use the IDE/Text editor that they are most comfortable with, and most of them will support plugins that help in collaboration. 

Example(s): Visual Studio Code

Most IDEs are similar in functionality and preferences are likely subjective. Therefore, while the team would prefer to work with the same IDE, flexibility is retained.
