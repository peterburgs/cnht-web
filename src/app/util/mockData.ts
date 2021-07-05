import { Lecture } from "../models/lecture.model";
import { Section } from "../models/section.model";
import { Comment } from "../models/comment.model";
export const sectionList : Section[]=[
    {
        courseId:'1',
        id:'course1sec1',
        title:'Lý thuyết phương trình Phương trình tuyến tính Phương trình tuyến tính Phương trình tuyến tính',
        isHidden: false,
        sectionOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      
    },
    {
        courseId:'1',
        id:'course1sec2',
        title:'Phương trình tuyến tính Phương trình tuyến tính Phương trình tuyến tính Phương trình tuyến tính Phương trình tuyến tính',
        isHidden: false,
        sectionOrder: 2,
        createdAt:new Date(),
        updatedAt: new Date(),
    
    },
    {
        courseId:'2',
        id:'course2sec1',
        title:'Lý thuyết phương trình Phương trình tuyến tính Phương trình tuyến tính Phương trình tuyến tính Phương trình tuyến tính',
        isHidden: false,
        sectionOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      
    },
    {
        courseId:'2',
        id:'course2sec2',
        title:'Lý thuyết phương trình',
        isHidden: false,
        sectionOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        
    },
    {
        courseId:'2',
        id:'course2sec3',
        title:'Giai bai toan vi du',
        isHidden: false,
        sectionOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
    
    },
   
]

export const lectureList :Lecture[]=[
    {
        id:'co1sec1lec1',
        title:"Video 1",
        lectureOrder:1,
        idHidden:false,
        sectionId:'course1sec1',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co1sec1lec2',
        title:"Video 2",
        lectureOrder:2,
        idHidden:false,
        sectionId:'course1sec1',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co1sec2lec1',
        title:"Video 1",
        lectureOrder:1,
        idHidden:false,
        sectionId:'course1sec2',
        createdAt:new Date(),
        updatedAt:new Date()},
    {
        id:'co1sec2lec2',
        title:"Video 2",
        lectureOrder:2,
        idHidden:false,
        sectionId:'course1sec2',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co1sec2lec3',
        title:"Video 3",
        lectureOrder:3,
        idHidden:false,
        sectionId:'course1sec2',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co2sec1lec1',
        title:"Video 1",
        lectureOrder:1,
        idHidden:false,
        sectionId:'course2sec1',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co2sec1lec2',
        title:"Video 2",
        lectureOrder:2,
        idHidden:false,
        sectionId:'course2sec1',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co2sec1lec3',
        title:"Video 3",
        lectureOrder:3,
        idHidden:false,
        sectionId:'course2sec1',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co2sec2lec1',
        title:"Video 1",
        lectureOrder:1,
        idHidden:false,
        sectionId:'course2sec2',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co2sec3lec1',
        title:"Video 1",
        lectureOrder:1,
        idHidden:false,
        sectionId:'course2sec3',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co2sec3lec2',
        title:"Video 2",
        lectureOrder:2,
        idHidden:false,
        sectionId:'course2sec3',
        createdAt:new Date(),
        updatedAt:new Date()
    }
]


export const listComment: Comment[]=[
    {
        id: '1',
        commentText: "Bài giảng của thầy rất bổ ích",
        parentId: "",
        userId: "user01",
        lectureId: 'co1sec1lec1',
        createdAt: new Date(),
        updatedAt:  new Date(),
        idHidden: false
    },
    {
        id: '2',
        commentText: "Bài giảng của thầy rất bổ ích",
        parentId: "1",
        userId: "user02",
        lectureId: 'co1sec1lec1',
        createdAt: new Date(),
        updatedAt:  new Date(),
        idHidden: false
    },
    {
        id: '3',
        commentText: "Bài giảng của thầy rất bổ ích",
        parentId: "1",
        userId: "user01",
        lectureId: 'co1sec1lec1',
        createdAt: new Date(),
        updatedAt:  new Date(),
        idHidden: true
    },
    {
        id: '4',
        commentText: "Helloooooooo",
        parentId: "",
        userId: "user03",
        lectureId: 'co1sec1lec1',
        createdAt: new Date(),
        updatedAt:  new Date(),
        idHidden: true
    },
    {
        id: '5',
        commentText: "Bài giảng của thầy rất bổ ích",
        parentId: "4",
        userId: "user04",
        lectureId: 'co1sec1lec1',
        createdAt: new Date(),
        updatedAt:  new Date(),
        idHidden: false
    },
    {
        id: '6',
        commentText: "Bài giảng của thầy rất bổ ích",
        parentId: "",
        userId: "user03",
        lectureId: 'co1sec1lec1',
        createdAt: new Date(),
        updatedAt:  new Date(),
        idHidden: false
    },
    {
        id: '7',
        commentText: "Bài giảng của thầy rất bổ ích",
        parentId: "",
        userId: "user01",
        lectureId: 'co2sec1lec1',
        createdAt: new Date(),
        updatedAt:  new Date(),
        idHidden: false
    }


]
