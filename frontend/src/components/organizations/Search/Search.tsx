'use client'
import s from './Search.module.css'
import React, {FC, useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search as SearchIcon} from "lucide-react";

interface ISearchAndFiltersProps {
  emitSearch: (search: string) => void
}

const Search: FC<ISearchAndFiltersProps> = ({emitSearch}) => {
  const [search, setSearch] = useState<string>('')
  const isDisabled = search.trim().length === 0;

  const handleSearch = () => {
    emitSearch(search)
    setSearch('')
  }
  return (
      <div className={s.search}>
        <Input
            placeholder={'Поиск...'}
            onChange={e => setSearch(e.target.value.toString())}
            value={search}/>
        <Button
            disabled={isDisabled}
            variant={isDisabled ? 'secondary' : 'default'}
            onClick={handleSearch}
        >
          <SearchIcon/>
        </Button>
      </div>
  );
};

export default Search;