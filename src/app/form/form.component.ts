import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';




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
      rating: null,
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
