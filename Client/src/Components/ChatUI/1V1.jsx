const UserComponent = ({ user }) => {
  console.log(user);
  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
};

export default UserComponent;
