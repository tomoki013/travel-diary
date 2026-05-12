"use client";
import { sectionVariants } from "@/components/common/animation";
import { motion } from "framer-motion";

interface PhotoFilterProps {
  filterList: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const PhotoFilter = ({ filterList, activeFilter, setActiveFilter }: PhotoFilterProps) => {
  return (
    <motion.div variants={sectionVariants} className="mb-12 flex flex-wrap justify-center gap-2">
      {filterList.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            activeFilter === filter ? "text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {activeFilter === filter && (
            <motion.div
              layoutId="active-filter-background"
              className="absolute inset-0 rounded-full bg-teal-600"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {activeFilter === filter ? filter : filter.split("・")[0]}
          </span>
        </button>
      ))}
    </motion.div>
  );
};

export default PhotoFilter;
