import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { map, finalize } from 'rxjs/operators';


@Injectable({
 providedIn: 'root'
})
export class FileService {
 public uploadSuccess: boolean = false;
 constructor(
  private http: HttpClient,
  @Inject(PLATFORM_ID) private platformId: any,
  ) {} 

 public upload(data: any): any {
   console.log(data, 'data');
    try {
      this.http.post('./api/files', {'data': data, 'file': data.photoId['file']})
      .pipe(finalize(() => console.log('finalize')))
      .subscribe(res => {
        console.log(res, 'success');
        this.uploadSuccess = true;
        return {'upload':'success'};
      }, error => {
        console.log(error)
      });
      
    }
    catch(error) {
      console.error(error);
    }
 }

}
