import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { randText } from '@ngneat/falso';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  constructor(private http: HttpClient) {}

  todos = signal<Todo[]>([]);
  loading = signal(false);
  withState = computed(() => ({
    todos: this.todos(),
    loading: this.loading(),
  }));

  getTodos() {
    this.loading.set(true);
    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe((todos) => {
        this.todos.set(todos);
        this.loading.set(false);
      });
  }

  updateTodos(todo: Todo) {
    const updatedTodo = {
      ...todo,
      title: randText(),
    };

    this.http
      .put<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        JSON.stringify(updatedTodo),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
      .subscribe({
        next: (todoUpdated: Todo) => {
          this.todos.update((todos) =>
            todos.map((t) => (t.id === todoUpdated.id ? todoUpdated : t)),
          );
        },
        error: (error) => {
          console.error('Error updating todo:', error);
          // Fallback: update local state even if API fails
          this.todos.update((todos) =>
            todos.map((t) => (t.id === todo.id ? updatedTodo : t)),
          );
        },
      });
  }

  deleteTodos(todo: Todo) {
    this.http
      .delete<Todo>(`https://jsonplaceholder.typicode.com/todos/${todo.id}`)
      .subscribe({
        next: () => {
          this.todos.update((todos) => todos.filter((t) => t.id !== todo.id));
        },
        error: (error) => {
          console.error('Error deleting todo:', error);
          // Fallback: remove from local state even if API fails
          this.todos.update((todos) => todos.filter((t) => t.id !== todo.id));
        },
      });
  }
}
