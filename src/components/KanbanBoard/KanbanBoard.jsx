import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useState } from "react";
import Card from "../Card/Card";
import { fetchData } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const [url, setUrl] = useState("");

  const data = useSelector((state) => state.reducer.data);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      const destinationColIndex = data.findIndex(
        (e) => e.id === destination.droppableId
      );

      const sourceCol = data[sourceColIndex];
      const destinationCol = data[destinationColIndex];

      const sourceTask = [...sourceCol.tasks];
      const destinationTask = [...destinationCol.tasks];

      const [movedTask] = sourceTask.splice(source.index, 1);
      movedTask.position = destination.droppableId;

      destinationTask.splice(destination.index, 0, movedTask);

      data[sourceColIndex].tasks = sourceTask;
      data[destinationColIndex].tasks = destinationTask;
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-around align-items-center"
        style={{ width: "800px", marginInline: "auto" }}
      >
        <Form style={{ width: "80%" }}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              style={{
                marginTop: "17px",
                borderRadius: "0px",
                border: "1px black solid",
              }}
              type="email"
              placeholder="Enter REPO url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Button
          variant="dark"
          type="button"
          style={{
            backgroundColor: "transparent",
            borderRadius: "0px",
            color: "black",
          }}
          onClick={(event) => {
            event.preventDefault();
            dispatch(fetchData(url));
            console.log("clicked");
          }}
        >
          Load issues
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban justify-content-center mt-5">
          {data.map((section) => (
            <Droppable key={section.id} droppableId={section.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  className="kanban__section"
                  ref={provided.innerRef}
                >
                  <div className="kanban__section__title">{section.title}</div>
                  <div className="kanban__section__content">
                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? "0.5" : "1",
                            }}
                          >
                            <Card key={task.id} updates={task.updates}>
                              {task.title}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
export default KanbanBoard;
