import React from "react";
import { useEffect, useState } from "react";
import "./App.css";

type CourseType = {
  heading: string;
  name: string;
  id: string;
  enrollments: [{ name: string; email: string; id: string }];
};

const Course = ({ enrollments }) => {
  return (
    <div className="container  mt-6">
      <h1 className="container mx-auto bg-gray-400 rounded-xl p-3 mb-5">
        Enrolled Users
      </h1>
      {enrollments && (
        <div className="grid md:grid-cols-3 gap-3">
          {enrollments.map((enrollment) => {
            return (
              <div className="p-3 m-2 w-full">
                <div className="flex space-x-4">
                  <div className="avatar">
                    <img
                      className="w-16 rounded-full"
                      src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    />
                  </div>
                  <div className="space-y-1 py-2">
                    <div> {enrollment.name}</div>
                    <div>{enrollment.email}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function App() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseList, setCourseList] = useState([]);
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
    <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
      {/* body - shows list of courses */}
      <div className="container mx-auto bg-gray-400 rounded-xl p-8 m-5">
        {/* header */}
        <div>
          <h1 className="container mx-auto bg-gray-400 rounded-xl p-3 mb-5">
            Courses
          </h1>
        </div>
        {courseList && (
          <div className="grid md:grid-cols-3 gap-5">
            {courses.map((course: CourseType) => {
              return (
                <div
                  className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  key={course.id}
                  id={course.id}
                  onClick={() => handleCourseClick(course.id)}
                >
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {course.name}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    {course.heading}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* drawer opens that contains list of users in each course */}

        {isOpen && <Course enrollments={enrollments} />}
      </div>
    </div>
  );
}

export default App;
