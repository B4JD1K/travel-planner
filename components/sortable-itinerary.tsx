import {Location} from "@/app/generated/prisma";
import {closestCorners, DndContext, DragEndEvent} from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useId, useState} from "react";
import {CSS} from "@dnd-kit/utilities";
import {reorderItinerary} from "@/lib/actions/reorder-itinerary";
import {Menu} from "lucide-react";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({item}: { item: Location }) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: item.id})

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{transform: CSS.Transform.toString(transform), transition}}
      className="p-4 border rounded-md flex items-center hover:shadow transition-shadow"
    >
      <div className="text-sm w-25 flex text-gray-500 items-center">
        <Menu className="w-6 h-6 text-gray-100 hover:text-gray-300 hover:transition-shadow"/>
        <p className="flex items-center ml-2 mr-2 justify-start font-medium">Loc. {item.order + 11}</p>
      </div>

      <div className="w-1/2 ml-2">
        <h4 className="font-medium text-gray-800">{item.locationTitle}</h4>
        <p className="text-xs text-gray-500 max-w">{`Latitude: ${item.lat}`}</p>
        <p className="text-xs text-gray-500 max-w">{`Longitude: ${item.lon}`}</p>
      </div>
    </div>
  )
}

export default function SortableItinerary({locations, tripId}: SortableItineraryProps) {
  const id = useId();
  const [localLocations, setLocalLocations] = useState(locations);

  const handleDragEnd = async (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id !== over?.id) {
      const oldIndex = localLocations.findIndex((oldLoc) => oldLoc.id === active.id);
      const newIndex = localLocations.findIndex((newLoc) => newLoc.id === over!.id);

      const newLocationsOrder = arrayMove(localLocations, oldIndex, newIndex)
        .map((item, index) => (
          {...item, order: index}
        ))
      setLocalLocations(newLocationsOrder)

      await reorderItinerary(tripId, newLocationsOrder.map((rLoc) => rLoc.id))
    }
  }

  return (
    <DndContext
      id={id}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localLocations.map((loc) => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4 mt-4">
          {localLocations.map((item, key) => (
            <SortableItem key={key} item={item}/>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}