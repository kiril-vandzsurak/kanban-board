const Card = (props) => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <div>{props.children}</div>
      {props.updates &&
        props.updates.map((update) => (
          <div>
            Updated by {update.editor} on {update.date}
          </div>
        ))}
    </div>
  );
};
export default Card;
