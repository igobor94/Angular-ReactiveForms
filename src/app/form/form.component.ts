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

function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  const emailControl = c.get('email');
  const confirmControlEmail = c.get('confirmEmail');

  if (emailControl?.value === confirmControlEmail?.value) {
    return null
  }
  if (emailControl?.pristine === confirmControlEmail?.pristine) {
    return null
  }
  return { 'match': true };
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
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, {validator: emailMatcher}),
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
