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
  const [users, setUsers] = useState([]); // would like to create User type to make code more resilient/stable
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

      // Check for basic error status codes
      if (courseData.status >= 400) {
        console.error(
          `Failed to fetch courses with response code: ${courseData.status}`
        );
        return;
      }

      const coursesResults = await courseData.json();

      const newCourses = await coursesResults;
      setCourses(newCourses.courses);

      // creates dictionary of courses keyed on course id for easier lookup
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

      // Check for basic error status codes
      if (usersData.status >= 400) {
        console.error(
          `Failed to fetch users with response code: ${usersData.status}`
        );
        return;
      }

      const userResults = await usersData.json();
      const newUsers = await userResults;
      setUsers(newUsers.users);

      // creates dictionary of users keyed on user id for easier lookup
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

  // click handler that displays list of enrolled users for each course.
  const handleCourseClick = (id) => {
    console.log(id);
    setCourseId(id); // sets course_Id to id of selected course to use to fetch enrollments
    setIsOpen(!isOpen); // sets isOpen state to display/hide enrolled users when clicked

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

      // Check for basic error status codes
      if (response.status >= 400) {
        console.error(
          `Failed to fetch list of course's enrolled users with response code: ${response.status}`
        );
        return;
      }

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
          <div>
            <h1 className=" mb-5 text-4xl">Courses</h1>
          </div>

          {/* show list of courses */}
          {courseList && (
            <div className="grid md:grid-cols-3">
              {courses.map((course: CourseType) => {
                return (
                  <div
                    className=" max-w-sm rounded-xl shadow-lg shadow-gray-500 hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-200 m-7"
                    key={course.id}
                    id={course.id}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <img
                      className="w-full max-h-60 object-cover rounded-t-xl"
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

          {/*  opens list of users in each course */}
          {isOpen && <CourseEnrollments enrollments={enrollments} />}
        </div>
      </div>
    </>
  );
}

export default App;
