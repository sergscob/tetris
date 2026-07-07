import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { move, rotate, softDrop, hardDrop } from '../actions/game';

const KEY_ACTIONS = {
  ArrowLeft: () => move('left'),
  ArrowRight: () => move('right'),
  ArrowUp: () => rotate(),
  ArrowDown: () => softDrop(),
  ' ': () => hardDrop(),
};

const useKeyboard = enabled => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!enabled) 
      return undefined;

    const handleKeyDown = event => {
      const createAction = KEY_ACTIONS[event.key]
      if (!createAction) 
        return;
      
      event.preventDefault()
      dispatch(createAction())
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, dispatch]);
};

export default useKeyboard;
