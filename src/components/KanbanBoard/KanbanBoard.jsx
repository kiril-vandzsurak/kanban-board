import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import Card from "../Card/Card";

const KanbanBoard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "https://api.github.com/repos/facebook/react/issues"
        );
        if (!Array.isArray(result.data)) {
          throw new Error("Data is not an array");
        }
        setData([
          {
            id: "todo",
            title: "To do",
            tasks: result.data.map((task) => ({
              id: task.id.toString(),
              title: task.title,
              updates: [
                {
                  date: task.updated_at,
                  editor: task.user.login,
                },
              ],
              position: "todo", // Add the position property with an initial value of "todo"
            })),
          },
          {
            id: "in-progress",
            title: "In Progress",
            tasks: [],
          },
          {
            id: "done",
            title: "Done",
            tasks: [],
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    // const storedData = localStorage.getItem("data");
    // if (storedData) {
    //   setData(JSON.parse(storedData));
    // }
    // window.addEventListener("beforeunload", () => {
    //   localStorage.setItem("data", JSON.stringify(data));
    // });
  }, []);

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
      movedTask.position = destination.droppableId; // Update the position property of the moved task

      destinationTask.splice(destination.index, 0, movedTask);

      data[sourceColIndex].tasks = sourceTask;
      data[destinationColIndex].tasks = destinationTask;

      setData(data);
      //localStorage.setItem("data", JSON.stringify(data));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban">
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
                            <div className="kanban__card__position">
                              Current issue position: {task.position}
                            </div>
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
  );
};
export default KanbanBoard;
