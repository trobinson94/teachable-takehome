import React from "react";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import CourseEnrollments from "./components/CourseEnrollments";

type CourseType = {
  heading: string;
  name: string;
  id: string;
  image_url: string;
  enrollments: [{ name: string; email: string; id: string }];
};

function App() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseList, setCourseList] = useState({});
  const [userList, setUserList] = useState({});
  const [courseId, setCourseId] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const courseData = await fetch(
        "https://developers.teachable.com/v1/courses",
        {
          headers: {
            accept: "application/json",
            apiKey: "7JbSA3ep6XOMV3t8t7QXuXq9HS79Dwnr",
          },
        }
      );

      const coursesResults = await courseData.json();

      const newCourses = await coursesResults;
      setCourses(newCourses.courses);

      const coursesDict = newCourses.courses.reduce((acc, currVal) => {
        return {
          ...acc,
          [currVal.id]: {
            name: currVal.name,
            heading: currVal.heading,
          },
        };
      }, []);

      setCourseList(coursesDict);
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await fetch(
        "https://developers.teachable.com/v1/users",
        {
          headers: {
            accept: "application/json",
            apiKey: "7JbSA3ep6XOMV3t8t7QXuXq9HS79Dwnr",
          },
        }
      );

      const userResults = await usersData.json();
      const newUsers = await userResults;
      setUsers(newUsers.users);

      const usersDict = newUsers.users.reduce((acc, currVal) => {
        return {
          ...acc,
          [currVal.id]: {
            name: currVal.name,
            email: currVal.email,
          },
        };
      }, []);

      setUserList(usersDict);
    };

    fetchUsers();
  }, []);

  const handleCourseClick = (id) => {
    console.log(id);
    setCourseId(id);
    setIsOpen(!isOpen);

    const enrollmentsFetch = async () => {
      const response = await fetch(
        `https://developers.teachable.com/v1/courses/${id}/enrollments`,
        {
          headers: {
            accept: "application/json",
            apiKey: "7JbSA3ep6XOMV3t8t7QXuXq9HS79Dwnr",
          },
        }
      );
      const enrollmentsJson = await response.json();

      const enrolledStudentsInfo = enrollmentsJson.enrollments.map(
        ({ user_id }) => userList[user_id]
      );

      setEnrollments(enrolledStudentsInfo);
    };

    enrollmentsFetch();
  };

  return (
    <>
      <NavBar />
      <div className="mx-auto bg-gray-100 p-8">
        <div className="container mx-auto">
          {/* header */}
          <div>
            <h1 className=" mb-5 text-4xl">Courses</h1>
          </div>

          {/* body - shows list of courses */}
          {courseList && (
            <div className="grid md:grid-cols-3">
              {courses.map((course: CourseType) => {
                return (
                  <div
                    className="block max-w-sm rounded shadow-lg shadow-gray-500 hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-200 m-7"
                    key={course.id}
                    id={course.id}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <img
                      className="w-full max-h-60 object-cover"
                      src={course.image_url}
                    />
                    <div className="p-4">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-600">
                        {course.name}
                      </h5>
                      <p className="font-normal">{course.heading}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* drawer opens that contains list of users in each course */}

          {isOpen && <CourseEnrollments enrollments={enrollments} />}
        </div>
      </div>
    </>
  );
}

export default App;
