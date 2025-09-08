import { Input } from "./ui/input";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  handleKeyDown,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <Input
        placeholder="Search images..."
        className="w-96 shadow-md"
        value={searchTerm}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBar;
