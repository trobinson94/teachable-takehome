import React from "react";

const CourseEnrollments = ({ enrollments }) => {
  return (
    <div className="container p-3 mt-6 bg-white rounded-xl">
      <h1 className="p-3 mb-5 text-3xl">Enrolled Users</h1>
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

export default CourseEnrollments;
