import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

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

function watchChanges(c: AbstractControl) {
  const phoneControl = c.get('phone');

  phoneControl?.valueChanges.subscribe(value => console.log(value));
  phoneControl?.statusChanges.subscribe(value => console.log(value));
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  defaultForm: FormGroup | any;
  emailMessage: string = '';

  get addresses(): FormArray{
    return <FormArray>this.defaultForm.get('addresses')
  }


  private validationMessages: any = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address.'
  };

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
      notification: 'text',
      sendCatalog: true,
      addresses: this.fb.array([this.buildAddress() ])
    }) 

    // watchChanges(this.defaultForm)

    this.defaultForm.get('notification').valueChanges.subscribe((value: string) => this.setNotification(value))
    console.log(this.defaultForm.get('notification'));

    const emailControl = this.defaultForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(debounceTime(1000)).subscribe((value: any) => this.setMessage(emailControl))
  }

  save() {
    console.log(this.defaultForm)
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      state: '',
      zipCode: '',
    })
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      console.log(c)
      this.emailMessage = Object.keys(c.errors).map(key => this.validationMessages[key]).join('')
      console.log(this.emailMessage)
    }
    
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
