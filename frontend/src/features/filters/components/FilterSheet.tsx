import { Modal } from "../../../components/Modal";
import type { CarFilters, FilterValue } from "../../../types/filter";
import { FilterSidebar } from "./FilterSidebar";

type FilterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: CarFilters;
  onChange: (key: keyof CarFilters, value: FilterValue) => void;
};

export const FilterSheet = ({ open, onOpenChange, filters, onChange }: FilterSheetProps) => (
  <Modal title="Filters" open={open} onOpenChange={onOpenChange}>
    <FilterSidebar filters={filters} onChange={onChange} />
  </Modal>
);
