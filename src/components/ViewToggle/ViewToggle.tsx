import { CiGrid41, CiBoxList, CiMap } from 'react-icons/ci';

export type ViewType = 'grid' | 'list' | 'map';

interface ViewToggleProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export default function ViewToggle({ currentView, setView }: ViewToggleProps) {
  const views: { id: ViewType; icon: JSX.Element; alt: string; mobileHidden?: boolean }[] = [
    { id: 'grid', icon: <CiGrid41 />, alt: 'grid view' },
    { id: 'list', icon: <CiBoxList />, alt: 'list view', mobileHidden: true },
    { id: 'map', icon: <CiMap />, alt: 'map view' },
  ];

  return (
    <div className="flex items-center bg-white rounded-2xl">
      {views.map((view, index) => {
        const responsiveClasses = view.mobileHidden ? 'hidden md:flex' : 'flex';

        const isFirst = index === 0;
        const isLast = index === views.length - 1;
        const roundedClasses = isFirst ? 'rounded-l-2xl' : isLast ? 'rounded-r-2xl' : '';

        return (
          <button
            aria-label={view.alt}
            key={view.id}
            onClick={() => setView(view.id)}
            className={`${responsiveClasses} items-center justify-center w-12 h-12 transition-all ${roundedClasses} ${
              currentView === view.id ? 'bg-mintGreen text-forestGreen' : 'hover:bg-gray-200'
            }`}
          >
            <span className="text-xl">{view.icon}</span>
          </button>
        );
      })}
    </div>
  );
}

// import { CiGrid41 } from "react-icons/ci";
// import { CiBoxList } from "react-icons/ci";
// import { CiMap } from "react-icons/ci";

// export default function ViewToggle({
//   currentView,
//   setView,
// }: {
//   currentView: string;
//   setView: (view: string) => void;
// }) {
//   const views = [
//     { id: "grid", icon: <CiGrid41 />, alt: "grid view" },
//     { id: "list", icon: <CiBoxList />, alt: "list view", mobileHidden: true },
//     { id: "map", icon: <CiMap />, alt: "map view" },
//   ];

//   return (
//     <div className="flex items-center bg-white rounded-2xl">
//       {views.map((view, index) => {
//         const responsiveClasses = view.mobileHidden ? "hidden md:flex" : "flex";

//         const isFirst = index === 0;
//         const isLast = index === views.length - 1;
//         const roundedClasses = isFirst
//           ? "rounded-l-2xl"
//           : isLast
//           ? "rounded-r-2xl"
//           : "";

//         return (
//           <button
//             aria-label={view.alt}
//             key={view.id}
//             onClick={() => setView(view.id)}
//             className={`${responsiveClasses} items-center justify-center w-12 h-12 transition-all ${roundedClasses} ${
//               currentView === view.id
//                 ? "bg-mintGreen text-forestGreen"
//                 : "hover:bg-gray-200"
//             }`}
//           >
//             <span className="text-xl">{view.icon}</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }
