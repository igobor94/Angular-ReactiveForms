import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
      return { 'range': true }
    }
    return null
  }
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  defaultForm: FormGroup | any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.defaultForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      rating: [null, ratingRange(1, 5)],
      notification: 'text'
    })
  }

  save() {
    console.log(this.defaultForm)
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.defaultForm.get('phone');

    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required)
    } else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();
  }

}
