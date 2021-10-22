import {Button, Intent, MenuItem, TagProps} from '@blueprintjs/core';
import {ItemPredicate, ItemRenderer, MultiSelect} from '@blueprintjs/select';
import React, {useState} from 'react';

export interface IFilm {
  /** Title of film. */
  title: string;
  /** Release year. */
  year: number;
  /** IMDb ranking. */
  rank?: number;
}

export interface IMultiSelectExampleState {
  allowCreate: boolean;
  createdItems: IFilm[];
  fill: boolean;
  films: IFilm[];
  hasInitialContent: boolean;
  intent: boolean;
  items: IFilm[];
  openOnKeyDown: boolean;
  popoverMinimal: boolean;
  resetOnSelect: boolean;
  tagMinimal: boolean;
}

export type FieldMultiSelectProps = {
  items: any[];
  initItems: any[];
  onSelectChange: (indexField: any) => void;
}

const FieldMultiSelect: React.FC<FieldMultiSelectProps> = (props) => {

  const {items, initItems, onSelectChange} = props;


  const [state, setState] = useState<IMultiSelectExampleState>({
    allowCreate: false,
    createdItems: [],
    fill: true,
    films: initItems,
    hasInitialContent: false,
    intent: true,
    items,
    openOnKeyDown: false,
    popoverMinimal: true,
    resetOnSelect: true,
    tagMinimal: false,
  });

  const arrayContainsFilm = (films: IFilm[], filmToFind: IFilm): boolean => {
    return films?.some((film: IFilm) => film.title === filmToFind.title);
  }

  const deleteFilmFromArray = (films: IFilm[], filmToDelete: IFilm) => {
    return films?.filter(film => film !== filmToDelete);
  }


  const maybeDeleteCreatedFilmFromArrays = (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    items: IFilm[],
    createdItems: IFilm[],
    film: IFilm,
  ): { createdItems: IFilm[]; items: IFilm[] } => {
    const wasItemCreatedByUser = arrayContainsFilm(createdItems, film);

    // Delete the item if the user manually created it.
    return {
      createdItems: wasItemCreatedByUser ? deleteFilmFromArray(createdItems, film) : createdItems,
      items: wasItemCreatedByUser ? deleteFilmFromArray(items, film) : items,
    };
  }

  const deselectFilm = (index: number) => {
    const {films} = state;

    const film = films[index];
    const {createdItems: nextCreatedItems, items: nextItems} = maybeDeleteCreatedFilmFromArrays(
      state.items,
      state.createdItems,
      film,
    );

    // Delete the item if the user manually created it.
    const films1 = films?.filter((_film, i) => i !== index) || [];
    onSelectChange(films1);
    setState({
      ...state,
      createdItems: nextCreatedItems,
      films: films1,
      items: nextItems,
    });
  }

  const handleTagRemove = (_tag: React.ReactNode, index: number) => {
    deselectFilm(index);
  };

  const getSelectedFilmIndex = (film: IFilm) => {
    return state.films?.findIndex((f: any) => f.title === film.title);
  }

  const isFilmSelected = (film: IFilm) => {
    return getSelectedFilmIndex(film) !== -1;
  }

  const addFilmToArray = (films: IFilm[], filmToAdd: IFilm) => {
    return [...films, filmToAdd];
  }

  const maybeAddCreatedFilmToArrays = (
    items: IFilm[],
    createdItems: IFilm[],
    film: IFilm,
  ): { createdItems: IFilm[]; items: IFilm[] } => {
    const isNewlyCreatedItem = !arrayContainsFilm(items, film);
    return {
      createdItems: isNewlyCreatedItem ? addFilmToArray(createdItems, film) : createdItems,
      // Add a created film to `items` so that the film can be deselected.
      items: isNewlyCreatedItem ? addFilmToArray(items, film) : items,
    };
  }

  const selectFilms = (filmsToSelect: IFilm[]) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const {createdItems, films, items} = state;

    let nextCreatedItems = createdItems.slice();
    let nextFilms = films?.slice();
    let nextItems = items?.slice();

    filmsToSelect.forEach(film => {
      const results = maybeAddCreatedFilmToArrays(nextItems, nextCreatedItems, film);
      nextItems = results.items;
      nextCreatedItems = results.createdItems;
      // Avoid re-creating an item that is already selected (the "Create
      // Item" option will be shown even if it matches an already selected
      // item).
      nextFilms = !arrayContainsFilm(nextFilms, film) ? [...nextFilms, film] : nextFilms;
    });

    console.log(143, 'nextFilms', nextFilms);
    onSelectChange(nextFilms);
    setState({
      ...state,
      createdItems: nextCreatedItems,
      films: nextFilms,
      items: nextItems,
    });
  }

  const selectFilm = (film: IFilm) => {
    selectFilms([film]);
  }


  const handleFilmSelect = (film: IFilm) => {
    if (!isFilmSelected(film)) {
      selectFilm(film);
    } else {
      deselectFilm(getSelectedFilmIndex(film));
    }

  };

  const handleFilmsPaste = (films: IFilm[]) => {
    // On paste, don't bother with deselecting already selected values, just
    // add the new ones.
    selectFilms(films);
  };


  const createFilm = (title: string): IFilm => {
    return {
      rank: 100 + Math.floor(Math.random() * 100 + 1),
      title,
      year: new Date().getFullYear(),
    };
  }

  const renderCreateFilmOption = (
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>,
  ) => (
    <MenuItem
      icon="add"
      text={`Create "${query}"`}
      active={active}
      onClick={handleClick}
      shouldDismissPopover={false}
    />
  );

  const {allowCreate, films, hasInitialContent, tagMinimal, popoverMinimal, ...flags} = state;

  const maybeCreateNewItemFromQuery = allowCreate ? createFilm : undefined;
  const maybeCreateNewItemRenderer = allowCreate ? renderCreateFilmOption : null;

  const filterFilm: ItemPredicate<IFilm> = (query, film, _index, exactMatch) => {
    const normalizedTitle = film.title.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    }
    return `${film.rank}. ${normalizedTitle} ${film.year}`.indexOf(normalizedQuery) >= 0;

  };

  // NOTE: not using Films.itemRenderer here so we can set icons.
  const renderFilm: ItemRenderer<IFilm> = (film, {modifiers, handleClick}) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        icon={isFilmSelected(film) ? "tick" : "blank"}
        key={film?.rank}
        label={film?.year?.toString()}
        onClick={handleClick}
        text={`${film?.rank}. ${film?.title}`}
        shouldDismissPopover={false}
      />
    );
  };

  const filmSelectProps = {
    itemPredicate: filterFilm,
    itemRenderer: renderFilm,
    items,
  };


  const FilmMultiSelect = MultiSelect.ofType<IFilm>();


  const initialContent = state.hasInitialContent ? (
      <MenuItem disabled={true} text={`${items?.length} items loaded.`}/>
    ) : // explicit undefined (not null) for default behavior (show full list)
    undefined;

  const areFilmsEqual = (filmA: IFilm, filmB: IFilm) => {
    // Compare only the titles (ignoring case) just for simplicity.
    return filmA.title.toLowerCase() === filmB.title.toLowerCase();
  }

  const renderTag = (film: IFilm) => film.title;

  const handleClear = () => setState({...state, films: []});


  const clearButton =
    films?.length > 0 ? <Button icon="cross" minimal={true} onClick={handleClear}/> : undefined;

  const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];


  const getTagProps = (_value: React.ReactNode, index: number): TagProps => ({
    intent: state.intent ? INTENTS[index % INTENTS.length] : Intent.NONE,
    minimal: tagMinimal,
  });

  return (<>
    <FilmMultiSelect
      {...filmSelectProps}
      {...flags}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      // @ts-ignore
      createNewItemRenderer={maybeCreateNewItemRenderer}
      initialContent={initialContent}
      itemRenderer={renderFilm}
      itemsEqual={areFilmsEqual}
      // we may customize the default filmSelectProps.items by
      // adding newly created items to the list, so pass our own
      items={state.items}
      noResults={<MenuItem disabled={true} text="No results."/>}
      onItemSelect={handleFilmSelect}
      onItemsPaste={handleFilmsPaste}
      popoverProps={{minimal: popoverMinimal}}
      tagRenderer={renderTag}
      tagInputProps={{
        onRemove: handleTagRemove,
        rightElement: clearButton,
        tagProps: getTagProps,
      }}
      selectedItems={state.films}
    />
  </>);
}

export default React.memo(FieldMultiSelect)
