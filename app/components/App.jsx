import React from 'react';
import BookSelector from './BookSelector';

const BookCard = ({ item }) => (
  <div className="book-card">
    <div className="book-card__title">{item.item.title}</div>
    <div className="book-card__info">
      {item.item.author} 
      <span className="book-card__year">{item.item.year}</span>
    </div>
  </div>
);

export default class App extends React.Component {
  render() {
    return <div>
      <BookSelector 
        inputProps={{ placeholder: 'Plain book finder — who\'s N...i...k...o...' }}
      />
      <BookSelector
        inputProps={{ placeholder: 'Custom hint layout — find Fyodor' }} 
        Item={BookCard}
      />
      <BookSelector
        inputProps={{ placeholder: 'Fallback to suggested reading — try Piotr' }}
        fallback
      />
    </div>;
  }
}
