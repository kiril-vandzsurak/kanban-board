const Card = (props) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px grey solid",
        borderRadius: "10px",
      }}
    >
      <div>{props.children}</div>
      {props.updates &&
        props.updates.map((update) => (
          <div>
            Updated by{" "}
            <span style={{ fontWeight: "bold" }}>{update.editor}</span> on{" "}
            {update.date}
          </div>
        ))}
    </div>
  );
};
export default Card;
